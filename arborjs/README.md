Arbor is a graph visualization library built with web workers and jQuery. Rather than trying to be an all-encompassing framework, arbor provides an efficient, **force-directed** layout algorithm plus abstractions for graph organization and screen refresh handling.

It leaves the actual screen-drawing to us. We use it with canvas for our performance needs.

First, it can bind user's input event such as click and touch.

Second, it can set node's properties like image, color and text.

The problem is the canvas will redraw continuously before the layout stop. So it will cost a lot of cpu resources. So we can call its stop api after a setting time like setTimeout(). When the layout stop, the graph keeps static until a user input event tiggers redraw().

Now we have integreted it with ETR. Though it has some problem, but it seems like fulfill our requirement.